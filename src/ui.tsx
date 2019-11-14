import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {
    Heading,
    ThemeProvider,
    themeRefresh,
    GlobalStyles,
} from '@patreon/studio'

class App extends React.Component {
    textbox: HTMLInputElement

    countRef = (element: HTMLInputElement) => {
        if (element) element.value = '5'
        this.textbox = element
    }

    onCreate = () => {
        const count = parseInt(this.textbox.value, 10)
        parent.postMessage(
            { pluginMessage: { type: 'create-rectangles', count } },
            '*',
        )
    }

    onCancel = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
    }

    render() {
        return (
            <ThemeProvider theme={themeRefresh}>
                <>
                    <GlobalStyles.GlobalBaseStyles />
                    <GlobalStyles.GlobalNormalizeStyles />
                    <div>
                        <Heading>Rectangle Creator</Heading>
                        <p>
                            Count: <input ref={this.countRef} />
                        </p>
                        <button id="create" onClick={this.onCreate}>
                            Create
                        </button>
                        <button onClick={this.onCancel}>Cancel</button>
                    </div>
                </>
            </ThemeProvider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('react-page'))
