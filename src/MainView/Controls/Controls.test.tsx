import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Controls, IControlsProps } from './Controls';

const onPlayBackRateChange = jest.fn();
const onReverbWetChange = jest.fn();
const onReverbDecayChange = jest.fn();
const onReverbPreDelayChange = jest.fn();

const testingProps: IControlsProps = {
    onPlayBackRateChange,
    onReverbWetChange,
    onReverbDecayChange,
    onReverbPreDelayChange,
    playbackRate: 1,
    reverbWet: 0.1,
    reverbDecay: 0.2,
    reverbPreDelay: 0.3
}

const cases = [
    ["playbackSpeed", onPlayBackRateChange],
    ["reverb", onReverbWetChange],
    ["decay", onReverbDecayChange],
    ["preDelay", onReverbPreDelayChange],
];

test.each(cases)("%s calls the right function when its value changes", (id, setFunction) => {
    const { getByTestId } = render(<Controls {...testingProps} />);
    fireEvent.change(getByTestId(id), { target: {
        value: "10"
    }});
    expect(setFunction).toHaveBeenCalledWith(10);
});
