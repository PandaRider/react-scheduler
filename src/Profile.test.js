import React from 'react';
import { shallow } from 'enzyme';
import Profile from '../src/containers/Profile';

it('Testing the testing framework', () => {
    const wrapper = shallow(<Profile />);
    expect(wrapper.find('div').text()).toEqual('Profile draft');
});