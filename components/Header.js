import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

import Colors from '../constants/colors';

const {primary} = Colors

const Header = props => {
    return(
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{props.title}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    header:{
        width: '100%',
        height: 90,
        paddingTop: 36,
        backgroundColor: primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        color: 'black',
        // font: 18
    }
});
export default Header;