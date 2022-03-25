import React, {useState} from 'react';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme'
import  {Dimensions, StatusBar} from 'react-native';
import Input from './components/Input'
import IconButton from './components/IconButton'
import { images } from './images'
import Task from './components/Task'

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
    const width = Dimensions.get('window').width
    const [newTask, setNewTask] = useState('')

    const _addTask = ()=>{
        alert(`Add: ${newTask}`)
        setNewTask('')
    }
    const _handleTextChange = text =>{
        setNewTask(text)
    }
    return (
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
                />
                <List width={width}>
                    <Task text="Hanbit"/>    
                    <Task text="React Native"/>    
                    <Task text="React Native Sample"/>    
                    <Task text="Edit TODO Item"/>    
                </List>
                {/* <IconButton type={images.uncompleted} />
                <IconButton type={images.completed} />
                <IconButton type={images.delete} />
                <IconButton type={images.update} /> */}
            </Container>
        </ThemeProvider>
    );
}
