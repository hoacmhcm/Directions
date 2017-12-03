import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SearchBar, Avatar, List, ListItem } from 'react-native-elements'

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';



export default function Menu({ onItemSelected }) {
  const list = [
    {
      name: 'Amy Farha',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President'
    },
    {
      name: 'Chris Jackson',
      avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman'
    },
  ]
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: "center" }}>
        <Avatar
          large
          rounded
          source={require('../assets/avatar.jpg')}
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
        />
        <Text>Chau Minh Hoa</Text>
      </View>
      <View style={{ flex: 7, backgroundColor: 'white' }}>
        <SearchBar
          lightTheme
          containerStyle={{ backgroundColor: 'white' }}
          placeholderTextColor='gray'
          placeholder='Type Here...' />
        <List containerStyle={{ marginBottom: 20 }}>
          {
            list.map((l, i) => (
              <ListItem
                roundAvatar
                avatar={{ uri: l.avatar_url }}
                key={i}
                title={l.name}
              />
            ))
          }
        </List>
      </View>
    </ View>
  );
}


const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'white',
    padding: 20,
  },
  avatarContainer: {
    flexDirection: 'column',
    backgroundColor: 'green',
    marginBottom: 20,
    marginTop: 20,
    padding: 50
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
});

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};
