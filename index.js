import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const defaultState = {
    markers: [
        {
            id: 1,
            latlng: { latitude: 10.8448376, longitude: 106.7765558 },
            image: require('./assets/menu.png'),
            title: 'Kẹt xe',
            description: 'Ngay trước sư phạm kỹ thuật'
        },
        {
            id: 2,
            latlng: { latitude: 10.848736, longitude: 106.770805 },
            image: require('./assets/menu.png'),
            title: 'Kẹt xe',
            description: 'Ngay trước sư phạm kỹ thuật'
        },
        {
            id: 3,
            latlng: { latitude: 10.849084, longitude: 106.771341 },
            image: require('./assets/menu.png'),
            title: 'Kẹt xe',
            description: 'Ngay trước sư phạm kỹ thuật'
        }
    ],
    textDirection: 'Quận 8'
}

export default class Directions extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}



const reducer = (state = defaultState, action) => {
    switch (action.type) {
        default:
            return state;
    }
}
const store = createStore(reducer);

AppRegistry.registerComponent('Directions', () => Directions);
