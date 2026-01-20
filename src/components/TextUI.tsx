import { Text,TextProps } from "react-native"

interface TypedText extends TextProps{
text:string;

}

const TextUI = ({text,style, ...props}:TypedText)=>{

    return(

        <Text style={style} {...props}>{text} </Text>
    )
}

export default TextUI