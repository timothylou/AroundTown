'use strict';

import React, { Component } from 'react';
import {
    TouchableHighlight,
    Text
} from 'react-native';

import ButtonStyle from '../styles/ButtonStyles';
import Colors from '../styles/Colors';

export default class ClickButton extends Component {

    render() {
        return (
            <TouchableHighlight underlayColor = {Colors.PRIMARY_DARK} style={[ButtonStyle.ClickButtonTouchable, {backgroundColor:this.props.color}]}
                                onPress={this.props.onPress}>
                <Text style={[ButtonStyle.ClickButtonText, {color: this.props.textcolor} ]}>{this.props.label}</Text>
            </TouchableHighlight>
        )
    }

}
