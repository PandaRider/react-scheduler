import React from 'react';
import Subjects from '../components/Subjects';
import TextField from '../components/TextField';
import { shallow } from 'enzyme';

it('form dialog to pop up', () => {
    const wrapper = shallow(<Subjects />);
    const submitButton = wrapper.find('button');
    expect(submitButton.simulate('click')).toBe(<TextField />);
})