import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Form, Item, Input, Label, Button , List,ListItem} from 'native-base'
import * as firebase from 'firebase'
import { firebaseConfig } from './config'
import Constants from 'expo-constants'


firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  state={
    text: "",
    mylist:[]
  }
  
    componentDidMount(){
      const myitems = firebase.database().ref("mywishes");
      myitems.on("value", datasnap=> {
       //console.log(Object.values(datasnap.val()))
       if(datasnap.val()){
          this.setState({mylist:Object.values(datasnap.val()) })
       }

      })
    }
    saveitem(){
      //console.log(this.state.text)
      const mywishes = firebase.database().ref("mywishes");
      mywishes.push().set({
        text:this.state.text,
        time:Date.now()
      })
      this.setState({text:""})
    }
    removeIt(){
      firebase.database().ref("mywishes").remove()
      this.setState({mylist:[{text:"removed Successfully"}] })
    }

    render(){
      console.log(this.state)
      const myitems = this.state.mylist.map(item=>{
        return(
          <ListItem style = {{justifyContent:'space-between'}} key={item.time}>
            <Text>{item.text}</Text>
            <Text>{new Date(item.time).toDateString()}</Text>
          </ListItem>
        )
      })
    return (
    <View style={styles.container}>
     <Item floatingLabel>
        <Label>Add Items</Label>
            <Input 
            value={this.state.text}
            onChangeText={(text)=>this.setState({text})}
            />
            </Item>
            <View style={{flexDirection:"row", padding:20, justifyContent:'space-around'}}>
              <Button rounded success
               style={styles.mybtn}
               onPress={()=>this.saveitem()}>
                <Text style={styles.text}>Add</Text>
              </Button>
              <Button rounded danger
               style={styles.mybtn}
               onPress={()=>this.removeIt()}
               >
                <Text style={styles.text}>Delete All</Text>
              </Button>
            </View>
            <List>
              {myitems}
            </List>

            
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight
  },
  
  text: {
    color:'white',
    fontSize:20,
  },
  mybtn: {
    padding:10,
    width:120,
    justifyContent:'center'
  }
});
