import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Picker, Button, Alert, TouchableOpacity} from 'react-native';

const createAlert = (actual, min, max, hora) =>
Alert.alert ('Para ', actual, ' la temperatura mínima es de: ', min, ' y la temperatura máxima es de: ', max, '. La zona horaria es: GMT- ', hora, [
  {
    text: 'Cancelar',
    style: "cancel",
    onPress: () => {
      console.log("El usuario canceló");
    }
  },
  {
    text: 'Aceptar',
    style: "cancel",
    onPress: () => {
      console.log("El usuario aceptó");
    }
  }
],
{cancelable: true}
);

export default function App() {
    const [paises, setPaises] = useState([]);
    const [paisActual, setPaiActual] = useState('');
    const [ciudadesPicker, setCiudadesPicker] = useState([]);
    const [ciudadActual, setCiudadActual] = useState('');

    //promise para carga de paises
    let countriesArray = [];
    useEffect(()=> {
      fetch('https://countriesnow.space/api/v0.1/countries/positions')
      .then(response => response.json())
      .then(data => {
        let countryInfo =data.data;
        //console.log("JSON: " + countryInfo.length)
        countryInfo.forEach(element => {
          countriesArray.push(element.name);
        });
        setPaises(countriesArray);
        //console.log(countryInfo[1].name);
      });
      
    }, []); 

    //console.log("PAISE: " + paises.length);
    //console.log(paises.toString());

    let arrPickerItems  = [];
    paises.map((item, index)=>{
      if(item != undefined){
        arrPickerItems.push(<Picker.Item label={item} value={item} key={index}/>)
      }
    });

    
    return(
      <View style={styles.container} > 
        <Picker 
          style={styles.countriesPicker}
          selectedValue={paisActual}
          onValueChange={(itemValue, itemIndex) => {
            setPaiActual(itemValue)
            let ciudad = {"country": itemValue}
            fetch('https://countriesnow.space/api/v0.1/countries/cities', 
            { 
              method: "post", 
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(ciudad)
            })
            .then(response => response.json())
            .then(data => {
              let arrPickerCiudades  = [];
              let ciudadesInfo = data.data;
              ciudadesInfo.map((item, index)=>{
                if(item != undefined){
                  arrPickerCiudades.push(<Picker.Item label={item} value={item} key={index}/>)
                }
              });
              setCiudadesPicker(arrPickerCiudades);
            });

          }}
        >
          <Picker.Item label="Elija el país que desea" value="Pais"/>
         {arrPickerItems}
        </Picker>

        {/* Picker de ciudades */}
        <Picker 
          style={styles.countriesPicker}
          selectedValue={ciudadActual}
          onValueChange={(itemValue, itemIndex) => {
            setCiudadActual(itemValue)
          }}
        >
          <Picker.Item label="Elija la ciudad que desea" value="Ciudad"/>
          {ciudadesPicker}
        </Picker>

        {/* Picker de monedas */}
        <Picker
          style={styles.countriesPicker}
        >
          <Picker.Item label="Elija su moneda" value="Dinero"/>
        </Picker>

        <TouchableOpacity
          style={styles.botones}
          onPress = {() => {
            const apiKey = '70ec9c8201b95e49cb2aeddc9f5c1bdb';
            fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ciudadActual},${paisActual}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
              let tempMin = data.main.temp_min
              let tempMax = data.main.temp_max
              let zHoraria = data.timezone
              tempMin = tempMin - 273.15
              tempMax = tempMax - 273.15
              tempMin = tempMin.toFixed(2)
              tempMax = tempMax.toFixed(2)
              zHoraria = zHoraria/3600 
              console.log("La temperatura minima es de: " + tempMin + " y la temperatura maxima es de: " + tempMax)
              console.log("La zona horaria es: GMT" + zHoraria)
              Alert.alert (`${paisActual} ${ciudadActual}`, `La temperatura mínima es de: ${tempMin} °C y la temperatura máxima es de: ${tempMax} °C. La zona horaria es: GMT- ${zHoraria}`)
            })
          }}
        >
          <Text style={styles.textoBoton} > Consultar información </Text>
        </TouchableOpacity>

      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EADA',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  countriesPicker:{
    height: 50,
    width: '60%',
    backgroundColor: '#aaa',
    borderBottomColor: '#bbb',
    borderBottomWidth: 2,
    marginBottom: 25
  },
  botones: {
    height: 40,
    width: '85%',
    borderRadius: 10,
    backgroundColor: "#4D8076",
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 18,
  }
});