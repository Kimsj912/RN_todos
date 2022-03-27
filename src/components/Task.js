import React, { useState } from 'react'
import styled from 'styled-components/native'
import Proptypes from 'prop-types'
import IconButton from './IconButton'
import { images } from '../images'
import Input from './Input'

const Container = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: ${({theme})=>theme.itemBackground};
    border-radius: 10px;
    padding: 5px;
    margin:3px 0px;
`;

const Contents = styled.Text`
    flex:1;
    font-size: 24px;
    color:${({theme, completed})=>completed? theme.done : theme.text};
    text-decoration-line : ${({completed})=> completed ? 'line-through': 'none'};
`;

const Task = ({item, deleteTask, toggleTask, updateTask})=>{
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState(item.text)

    const _handleUpdateButtonPress =()=>{
        setIsEditing(true)
    }
    const _onSubmitEditing = () =>{
        if(isEditing) {
            // Object.assign(대상객체, 출처객체) : 출처 객체(들의 모든 열거 가능한 자체 속성을 복사해 대상 객체에 붙여넣는 자바스크립트  함수
            // 대상객체와 출처객체에 같은 속성이 있다면 출처객체의 속성값으로 오버라이드 됨.
            const editTask = Object.assign({}, item, {text})
            setIsEditing(false)
            updateTask(editTask)
        }
    }
    const _onBlur = ()=>{
        if(isEditing) {
            setIsEditing(false)
            setText(item.text)
        }
    }
    return isEditing ? (
            <Input value={text} onChangeText={text=>setText(text)} onSubmitEditing={_onSubmitEditing} onBlur={_onBlur}/>
        ) : (
        <Container>
            <IconButton type={item.completed ? images.completed : images.uncompleted} id={item.id} onPressOut={toggleTask} completed={item.completed}/>
            <Contents completed={item.completed}>{item.text}</Contents>
            {item.completed || <IconButton type={images.update} onPressOut={_handleUpdateButtonPress}/>}
            <IconButton type={images.delete} id={item.id} onPressOut={deleteTask} completed={item.completed}/>
        </Container>
    )
}

Task.proptypes = {
    item:Proptypes.string.isRequired,
    deleteTask: Proptypes.func.isRequired,
    toggleTask: Proptypes.func.isRequired,
    updateTask: Proptypes.func.isRequired,
}
export default Task