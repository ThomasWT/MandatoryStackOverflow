import React, {Component} from 'react';

class AddQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: ""
        };

        this.onChange = this.onChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    onChange(event) {
        this.setState({
            input: event.target.value
        });
    }

    handleInput(event) {
        event.preventDefault();
        this.props.addQuestion(this.state.input);
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="itemText">New Item</label>
                            <input type="text" className="form-control" id="itemText"
                                   placeholder="How can I hack NASA?"
                                   onChange={this.onChange}
                            />
                            <small className="form-text text-muted">Write something for your TODO list
                            </small>
                        </div>
                        <button onClick={this.handleInput}
                                type="submit" id="submitItemBtn" className="btn btn-primary">Add Task
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
export default AddQuestion;