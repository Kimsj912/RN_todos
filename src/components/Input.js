import React from 'react'
import styled from 'styled-components/native'

// Input의 좌우에 여백없이 꽉차서 보여주는 문제를 해결하고자 Dimensions와 useWindowDimensions를 사용
//  https://reactnative.dev/docs/dimensions나 https://reactnative.dev/docs/usewindowdimensions를 이용하면 됨.
// 이 둘은 현재 기기의 화면 크기를 알 수 있고, 이를 이용해 다양한 크기의 기기에 동일한 모습으로 적용될 수 있도록 코드를 작성 가능하다
import { Dimensions } from 'react-native'
// import { useWindowDimensions } from 'react-native';

import PropTypes from 'prop-types'

const StyledInput = styled.TextInput.attrs(({theme})=>({
        placeholderTextColor : theme.main,
    }))`
    height: 60px;
    margin: 3px 0;
    padding: 15px 20px;
    border-radius: 10px;
    background-color: ${({theme})=>theme.itemBackground};
    font-size:25px;
    color: ${({theme})=>theme.text};
    /* useWindowDimensions나 Dimensions나 이는 동일함. */
    width: ${({width})=> width-40}px;
    `;

const Input = ({placeholder,value, onChangeText, onSubmitEditing}) =>{
    // Dimensions를 사용할 경우
    const width = Dimensions.get('window').width;
    // useWindowDimmensions를 사용할 경우
    // const width = useWindowDimensions().width;
    return <StyledInput 
        width={width} 
        placeholder={placeholder} 
        maxLength={50}
        // 키보드 설정 
            //// 첫글자 대문자 설정
            autoCapitalize="none"
            //// 오타 입력시 자동으로 수정하는 기능
            autoCorrect={false}
            //// ios의 키보드 완료버튼이 return인 문제 해결
            returnKeyType="done"
            //// ios의 키보드 색상 어둡게 변경
            keyboardAppearance = "dark"
        // Prop으로 받은거 설정
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
    />
}

// Props로 받는거 타입 정의
Input.proptypes={
    placeholder:PropTypes.string,
    value:PropTypes.string.isRequired,
    onChangeText:PropTypes.func.isRequired,
    onSubmitEditing:PropTypes.func.isRequired,
}

export default Input