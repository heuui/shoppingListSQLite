import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('productdb.db');

export default function App() {

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists product (id integer primary key not null, name text, amount text);');
    }, errorAlert, updateList); 
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into product (name, amount) values (?, ?);', [name, amount]);    
      }, errorAlert, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from product;', [], (_, { rows }) =>
        setProducts(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from product where id = ?;`, [id]);
      }, errorAlert, updateList
    )    
  }

  const errorAlert = () => {
    Alert.alert('Something went wrong');
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };


  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Name'
        style={styles.textbox}
        onChangeText={(name) => setName(name)}
        value={name}
      />
      <TextInput
        placeholder='Amount'
        style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button
        title='Save'
        onPress={saveItem}
      />
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList
        style={styles.flatlist}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => 
        <View style={styles.flatlist}>
          <Text 
            style={{fontSize: 18}}>{item.name}, {item.amout} 
          </Text>
          <Text 
            style={{fontSize: 18, color: '#0000ff'}} 
            onPress={() => deleteItem(item.id)}>Bought
          </Text>
        </View>}
        data={products}
        ItemSeparatorComponent={listSeparator} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textbox: {

    marginTop: 30,
    fontSize: 18,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  },
  flatlist: {
    flexDirection: 'row',
    backgroundColor: '#fff',
   },
});
