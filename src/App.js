import React, {useState} from 'react'
import styled, { ThemeProvider } from 'styled-components/native'
import { theme } from './theme'
import  {Dimensions, StatusBar} from 'react-native'
import Input from './components/Input'
import Task from './components/Task'
/***
 * AsyncStorage의 버전에 따라 _reactNative.default.setItem is not a function 과 같은 오류가 발생할 수 있다. 
 * (버전1.6.3으로 다운그레이드하면 해결됨) (https://github.com/react-native-async-storage/async-storage/issues/265)
 * 이 과정에서 cache가 남아있음으로서 에러가 발생됨 --> node_modules제거 뒤 npm install 진행하여 해결 (https://react-native-async-storage.github.io/async-storage/docs/help/troubleshooting/)
* 이또한 충돌이 계속 발생하여 expo doctor --fix-dependencies로 종속성을 맞춰 해결 시도
*  node_modules삭제 -> npm install -> npm srun --reset-cache -> rm -rf /tmp/metro-*
**/
import AsyncStorage from '@react-native-async-storage/async-storage' // 로컬에 데이터를 저장하고 불러오는 기능을 구현 (deprecated가 된 AsyncStorage보단 이를 사용해라)
/*** 
 * import { AppLoading } from 'expo' 를 사용하면 <AppLoading />에서 오류가 발생한다.
 *  expo를 가볍게 만드는 과정의 일환으로 AppLoading이 분리되면서 
 * AppLoading은 'expo'가 아닌 'expo-app-loading'에서 import가 이뤄지도록 바꿔야했다
***/
import AppLoading from 'expo-app-loading' 

// SafeAreaView는 노치디자인의 경우 컴포넌트가 가려지는 문제를 해결해줌.
const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    align-Items: center;
    justify-Content: center;
`;

const Title = styled.Text`
    font-size: 40px;
    font-weight: 600;
    color: ${({theme})=> theme.main};
    align-self : flex-start;
    margin: 0px 20px;
`

const List = styled.ScrollView`
    flex:1;
    width: ${({width})=>width-40}px;
`

export default function App() {
    // Variables
    const width = Dimensions.get('window').width
    const [newTask, setNewTask] = useState('')
    const [tasks, setTasks] = useState({})
    const [isReady, setIsReady] = useState(false)

    //  Functions
    const _saveTasks = async tasks =>{
        try{
            // tasks라는 이름으로 tasks객체를 json파일화하여 setItem으로 던져줌
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks))
            setTasks(tasks)
        }catch(e){
            console.log(e)
        }
    }
    const _loadTasks = async ()=>{
        const loadedTasks = await AsyncStorage.getItem('tasks')
        // 가져온 tasks들(loadedTasks)를 {} (객체형태)로 변환하여 setTasks를 통해 tasks의 값으로 바꿔줌
        setTasks(JSON.parse(loadedTasks || '{}'))
    }
    const _addTask = ()=>{
        const ID = Date.now().toString()
        const newTaskObject = {
            [ID] : {id:ID, text:newTask, complete:false},
        }
        setNewTask('')
        _saveTasks({...tasks, ...newTaskObject})
    }
    const _deleteTask = id=>{
        const currentTasks = Object.assign({}, tasks)
        delete currentTasks[id]
        _saveTasks(currentTasks)
    }
    const _toggleTask = id =>{
        const currentTasks = Object.assign({},tasks)
        currentTasks[id]['completed'] = !currentTasks[id]['completed']
        _saveTasks(currentTasks)
    }
    const _updateTask = item =>{
        const currentTasks = Object.assign({}, tasks)
        currentTasks[item.id] = item
        _saveTasks(currentTasks)
    }
    const _handleTextChange = text =>{
        setNewTask(text)
    }
    const _onBlur = ()=>{
        setNewTask('')
    }
    return (isReady ?(
        <ThemeProvider theme={theme}>
            <Container>
                {/* 상태바가 흰색으로 들어나도록 수정 */}
                <StatusBar barStyle='light-content' backgroundColor={theme.background}/>
                <Title>Todo List</Title>
                <Input 
                    placeholder="+Add a Task"
                    value={newTask}
                    onChangeText={_handleTextChange}
                    onSubmitEditing={_addTask}
                    onBlur={_onBlur}
                />
                <List width={width}>
                    {Object.values(tasks)
                        .reverse()
                        .map(item=>(
                            <Task 
                                key={item.id} 
                                item={item} 
                                deleteTask={_deleteTask} 
                                toggleTask={_toggleTask} 
                                updateTask={_updateTask}
                            />
                        ))
                    }
                </List>
            </Container>
        </ThemeProvider>
    ) : (
        // app.js에서 splash와 icon값은 로딩화면과 애플리케이션 아이콘을 설정하는 곳이다 
        // splash의 사진을 변경하며 공백이 생기는 문제는, "
        // splash" :{ image:"./assets/splash.png", "resizeMode":"contain", "backgroundColor":#색상코드"}
        // 를 통해 기기크기에 따른 공백을 제거가능)
        <AppLoading
            startAsync={_loadTasks}  // AppLoading컴포넌트가 동작하는 동안 실행될 함수
            onFinish={()=>setIsReady(true)} // startAsync가 완료되면 실행할 함수
            onError={console.error} // startAsync에서 오류 발생시 실행할 함수
        />
    ))
}
