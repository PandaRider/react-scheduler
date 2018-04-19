import React from 'react';
import Calendar from '../components/Calendar';
import Dialog from '../components/EventDialog';
import { shallow } from 'enzyme';

it('can show dialog when pressed', () => {
    const wrapper = shallow(<Calendar />);
    const tabButton = wrapper.find('button');
    tabButton.simulate('click');
    expect('tab opens', <Dialog />)
})