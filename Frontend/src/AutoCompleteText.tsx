import React from 'react';

type Props = {
  text: string;
};

type State = {
  suggestions: string[];
  text: string;
};

export default class AutoCompleteText extends React.Component<Props, State> {
  items: string[];

  constructor(props: Props) {
    super(props);
    this.items = [
      'React',
      'JavaScript',
      'TypeScript',
      'CSS',
      'HTML',
      'Python',
      'Java',
      'C',
      'C++',
      'Node.js',
      'Express',
      'Spring Boot',
      'SQL',
      'MongoDB',
      'Git',
      'Docker',
      'Kubernetes',
      'Machine Learning',
      'AI',
      'Tailwind CSS'];
    this.state = {
      suggestions: [],
      text: '',
    };
  }

  onTextChanged = (e: { target: { value: string } }) => {
    const value = e.target.value;
    let suggestions: string[] = [];

    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = this.items.sort().filter((v) => regex.test(v));
    }

    this.setState(() => ({ suggestions, text: value }));
  };

  suggestionSelected (value: string ) {
    this.setState(() => ({
      text: value,
      suggestions: [],
    }))
  }

  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map((item: string) => (
          <li
            key={item}
            onClick={() => this.suggestionSelected(item)}
            className="border border-gray-400 rounded px-2 py-1 cursor-pointer hover:bg-gray-200 w-max">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { text } = this.state;
    return (
      <div className="mt-6">
        <div className="flex flex-col gap-6 w-100 mx-auto">
          <input value={text}
            onChange={this.onTextChanged}
            type="text"
            className="border-2 border-black p-2 rounded-t"
          />
          {this.renderSuggestions()}
        </div>
      </div>
    );
  }
}
