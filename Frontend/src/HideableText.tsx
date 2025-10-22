import React from 'react';

type Props = {
    text: string;
};

type State = {
    isHidden: boolean;
};

export default class HideableText extends React.Component<Props, State> {
    constructor (props: Props) {
        super(props);
        this.state = {
            isHidden: false,
        };
        this.toggleIsHidden = this.toggleIsHidden.bind(this);

    }

    toggleIsHidden() {
        this.setState((currentState) => ({
            isHidden: !currentState.isHidden
        }));
    }


    render () {
        return (
            <>
            <div className="flex justify-start items-end">
                <button onClick={() => this.toggleIsHidden()}>Toggle</button>
                {!this.state.isHidden && this.props.text}
            </div>
            </>
        );
    }
}