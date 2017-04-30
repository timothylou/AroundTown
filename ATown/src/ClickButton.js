'use strict';

import React, { Component } from 'react';
import {
    TouchableHighlight,
    Text
} from 'react-native';

import ButtonStyle from './ButtonStyles';

export default class ClickButton extends Component {

    render() {
        return (
            <TouchableHighlight style={[ButtonStyle.ClickButtonTouchable, {backgroundColor:this.props.color}]}
                                onPress={this.props.onPress}>
                <Text style={ButtonStyle.ClickButtonText}>{this.props.label}</Text>
            </TouchableHighlight>
        )
    }

}
