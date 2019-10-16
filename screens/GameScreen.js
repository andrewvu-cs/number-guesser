import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenOrientation } from 'expo'

import NumberContainer from "../components/NumberContainer";
import Card from "../components/Card";
import TitleText from "../components/TitleText";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";
import BodyText from "../components/BodyText";

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const randNum = Math.floor(Math.random() * (max - min)) + min;
  if (randNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return randNum;
  }
};

const renderListItem = (listLength, itemData) => (
  <View style={styles.listItem}>
    <BodyText>#{listLength - itemData.index}</BodyText>
    <BodyText>{itemData.item}</BodyText>
  </View>
);

const GameScreen = props => {
  // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
  const initialGuess = generateRandomBetween(1, 100, props.userChoice);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
  const [rounds, setRounds] = useState(0);
  const [outBounds, setOutBounds] = useState(0);
  const [availDeviceWidth, setAvailDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availDeviceHeight, setAvailDeviceHeight] = useState(
    Dimensions.get("window").height
  );
  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props;

    useEffect(() => {
      const updateLayout = () => {
        setAvailDeviceWidth(Dimensions.get('window').width);
        setAvailDeviceHeight(Dimensions.get('window').height);
      };

      Dimensions.addEventListener('change', updateLayout);

      return() => {
        Dimensions.removeEventListener('change', updateLayout);
      }
    })

  useEffect(() => {
    if (currentGuess === userChoice) {
      onGameOver(rounds, outBounds);
    }
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = direction => {
    if (
      (direction === "lower" && currentGuess < props.userChoice) ||
      (direction === "greater" && currentGuess > props.userChoice)
    ) {
      Alert.alert("Don't lie!", "You know that this is wrong...", [
        { text: "Sorry!", style: "cancel" }
      ]);
      return setOutBounds(count => count + 1);
    }
    if (direction === "lower") {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }
    const nextNumber = generateRandomBetween(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );
    setCurrentGuess(nextNumber);
    setRounds(curRounds => curRounds + 1);
    setPastGuesses(curPastGuesses => [
      nextNumber.toString(),
      ...curPastGuesses
    ]);
  };

  if (availDeviceHeight < 500) {
    return (
      <View style={styles.screen}>
        <TitleText>Opponent's Guess</TitleText>

        <View style={styles.controls}>
          {/* <TitleText style={styles.roundsText}>
            Round: <Text style={styles.roundsHighlight}>{rounds + 1} </Text>
          </TitleText> */}
          <View style={styles.buttonContainer}>
            <MainButton onPress={nextGuessHandler.bind(this, "lower") }>
              <Ionicons name="md-remove" size={24} color="white" />
            </MainButton>
            <NumberContainer>{currentGuess}</NumberContainer>
            <MainButton onPress={nextGuessHandler.bind(this, "greater")}>
              <Ionicons name="md-add" size={24} color="white" />
            </MainButton>
          </View>
        </View>
        <View style={styles.listContainer}>
          {/* <ScrollView contentContainerStyle={styles.list}>
          {pastGuesses.map((guess, index) =>
            renderListItem(guess, pastGuesses.length - index)
          )}
        </ScrollView> */}
          <FlatList
            keyExtractor={item => item}
            data={pastGuesses}
            renderItem={renderListItem.bind(this, pastGuesses.length)}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TitleText>Opponent's Guess</TitleText>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={styles.buttonContainer}>
        {/* <TitleText style={styles.roundsText}>
          Round: <Text style={styles.roundsHighlight}>{rounds + 1} </Text>
        </TitleText> */}
        {/* <View style={styles.buttonContainer}> */}
          <MainButton onPress={nextGuessHandler.bind(this, "lower")}>
            <Ionicons name="md-remove" size={24} color="white" />
          </MainButton>
          <MainButton onPress={nextGuessHandler.bind(this, "greater")}>
            <Ionicons name="md-add" size={24} color="white" />
          </MainButton>
        {/* </View> */}
      </Card>
      <View style={styles.listContainer}>
        {/* <ScrollView contentContainerStyle={styles.list}>
          {pastGuesses.map((guess, index) =>
            renderListItem(guess, pastGuesses.length - index)
          )}
        </ScrollView> */}
        <FlatList
          keyExtractor={item => item}
          data={pastGuesses}
          renderItem={renderListItem.bind(this, pastGuesses.length)}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center"
  },
  cardContainer: {
    marginTop: 20,
    marginTop: Dimensions.get("window").height > 600 ? 20 : 5
  },
  roundsText: {
    padding: 20,
    width: "100%",
    maxWidth: "100%",
    textAlign: "center",
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Dimensions.get('window').height > 600 ? 20 : 5,
    width: 400,
    maxWidth: '90%',
    alignItems: 'center'
  },
  roundsHighlight: {
    color: Colors.primary,
    fontFamily: "open-sans-bold"
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    alignItems: "center"
  },
  listContainer: {
    flex: 1,
    width: Dimensions.get("window").width > 350 ? "60%" : "80%"
  },
  list: {
    flexGrow: 1,
    justifyContent: "flex-end"
  },
  listItem: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%"
  }
});

export default GameScreen;
