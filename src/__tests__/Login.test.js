import React from 'react';
import Login from '../containers/Login';
import { shallow } from 'enzyme';

it('can log in when pressed', () => {
    const wrapper = shallow(<Login />);
    const submitButton = wrapper.find('button');
    submitButton.simulate('click');

})