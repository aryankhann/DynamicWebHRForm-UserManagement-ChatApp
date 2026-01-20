import { TouchableOpacity, View } from "react-native"
import ButtonBlue from "../components/ButtonBlue"

const FormScreen = ({navigation}:any)=>{


    return(

        <View style={{flex:1,alignItems:'center'}}>
            <View style={{marginTop:'40%',width:'80%',gap:20}}>
<ButtonBlue text="Create Form" onNext={()=>navigation.navigate('AddForm')}/>
<ButtonBlue text="Edit Form"/>
</View>


        </View>
    )
}

export default FormScreen