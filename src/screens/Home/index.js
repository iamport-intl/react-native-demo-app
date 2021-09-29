import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Card from '../../elements/Card';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  image: {
    padding: 1,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '50%',
  },
  textContainer: {
    backgroundColor: 'transparent',
    color: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  textStyle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  cardContainer: {
    backgroundColor: '"rgba(61,61,61,.2)"',
    padding: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 0,
  },
});

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Image
          source={{uri: 'https://demo.chaipay.io/images/g1.jpg'}}
          style={styles.image}
        />
        <Image
          source={{uri: 'https://demo.chaipay.io/images/g2.jpg'}}
          style={styles.image}
        />
      </View>
      <View style={styles.rowContainer}>
        <Image
          source={{uri: 'https://demo.chaipay.io/images/g3.jpg'}}
          style={styles.image}
        />
        <Image
          source={{uri: 'https://demo.chaipay.io/images/g4.jpg'}}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Card style={styles.cardContainer}>
          <Text style={styles.textStyle}># For All Walks of Life !</Text>
        </Card>
      </View>
    </View>
  );
};

export default HomeScreen;
