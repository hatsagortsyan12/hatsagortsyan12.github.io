import * as React from "react";
import {Alert, Button, Form} from "react-bootstrap";
import {css} from "emotion";
import {StateContext} from "./App";
import {MIN_REMAINING} from "../constants/minRemaining";
import {
    centerClass,
    inputClass,
    lgMarginBottomClass,
    mainBtnClass,
    verticalCenteredLayoutClass
} from "./styleHelper/mainStyles";
import {TitleComponent} from "./shared/TitleComponent";
import {getLocalStorage} from "../shared/models/localstorage";

const rememberFieldGroupClass = css`
    margin-bottom: 30px;
`

const infoClass = css`
    margin-bottom: 40px;
`

const storage = getLocalStorage()

export const TransferComponent: React.FunctionComponent = React.memo(props => {
    const [validated, setValidated] = React.useState(false)
    const [isChecked, setIsChecked] = React.useState(!!storage.getItem('remember'))
    const {state} = React.useContext(StateContext);
    const accountId: React.RefObject<HTMLInputElement> = React.useRef(null)

    const onSubmitHandler = () => {
        setValidated(true)

        storage.setItem('remember', isChecked)

        if (isChecked) {
            storage.setItem('accountId', accountId.current!.value)
        } else {
            storage.removeItem('accountId')
        }
    }

    const checkOnchangeHandler = (event: any) => {
        setIsChecked(event.target.checked)
    }

    const disableTransfer = state.remaining <= MIN_REMAINING

    return <div className={verticalCenteredLayoutClass}>
        <TitleComponent>
            Փոխանցում
            <p>փոխանցում հասանելի գումարից</p>
        </TitleComponent>
        {disableTransfer &&
        <Alert className={infoClass} variant='info'>
            Դուք չունեք բավարար գեւմար Ձեր հաշվին
        </Alert>
        }
        <Form noValidate validated={validated}>
            <Form.Group>
                <Form.Control
                    ref={accountId}
                    className={inputClass}
                    required
                    type="text"
                    placeholder="Իդրամի հաշվեհամար"
                    defaultValue={storage.getItem('accountId') ? storage.getItem('accountId') : null}
                />
            </Form.Group>
            <Form.Group className={rememberFieldGroupClass}>
                <Form.Check
                    onChange={checkOnchangeHandler}
                    custom
                    label="Հիշել"
                    type='checkbox'
                    id='remember-checkbox'
                    checked={isChecked}
                />
            </Form.Group>

            <Form.Group className={lgMarginBottomClass} controlId="formBasicPassword">
                <Form.Control
                    className={inputClass}
                    required type="number" placeholder="Փոխանցվող գումարը"/>
            </Form.Group>

            <div className={centerClass}>
                <Button className={mainBtnClass} type="button" onClick={onSubmitHandler} disabled={disableTransfer}>
                    Փոխանցել
                </Button>
            </div>
        </Form>
    </div>
})
