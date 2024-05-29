"use client";
import { axiosInstance } from '@/utils/instance';
import React, { useState } from 'react'
import * as math from 'mathjs';

interface Props {
    result: string;
    setResult: React.Dispatch<React.SetStateAction<string>>;
    setHistory: React.Dispatch<React.SetStateAction<any>>;
}

interface HistoryItem {
    id: string;
    calculationName: string;
    calculationPattern: string;
    result: string;
}

const Calculator = ({ result, setResult, setHistory }: Props) => {
    const [calculationName, setCalculationName] = useState<string>('');
    const [calculationHistory, setCalculationHistory] = useState<string>('');
    const [selectedOperator, setSelectedOperator] = useState<string>('');

    console.log("result", result)
    console.log("calculationHistory", calculationHistory);
    console.log("selectedOperator", selectedOperator);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonName: string = e.currentTarget.name;

        if (isNaN(Number(buttonName))) {
            if (selectedOperator && selectedOperator !== buttonName) {
                setSelectedOperator(buttonName);
                setResult(result.slice(0, -1).concat(buttonName));
            } else if (!selectedOperator) {
                setSelectedOperator(buttonName);
                setResult(result.concat(buttonName));
            }
        } else {
            if (selectedOperator) {
                if (result.slice(-1) === selectedOperator) {
                    setResult(result.concat(buttonName));
                } else {
                    setResult(result + selectedOperator + buttonName);
                }
                setSelectedOperator('');
            } else {
                setResult(result.concat(buttonName));
            }
        }
    };

    const clear = () => {
        setResult('');
        setSelectedOperator('');
    };

    const backspace = () => {
        setResult(result.slice(0, -1));
        setSelectedOperator('');
    };

    const calculate = () => {
        try {
            setCalculationHistory(result)
            setResult(math.evaluate(result).toString());
            setSelectedOperator('');
        } catch (err) {
            setResult('Error');
        }
    };

    const inputButtonOption = [
        { "name": "", "value": /[+\-*/]/.test(result) ? "C" : "AC", "type": /[+\-*/]/.test(result) ? "remove" : "all_remove" },
        { "name": "-", "value": "+/-", "type": "algebra" },
        { "name": "%", "value": "%", "type": "algebra" },
        { "name": "/", "value": "/", "type": "method" },
        { "name": "7", "value": "7", "type": "number" },
        { "name": "8", "value": "8", "type": "number" },
        { "name": "9", "value": "9", "type": "number" },
        { "name": "*", "value": "X", "type": "method" },
        { "name": "4", "value": "4", "type": "number" },
        { "name": "5", "value": "5", "type": "number" },
        { "name": "6", "value": "6", "type": "number" },
        { "name": "-", "value": "-", "type": "method" },
        { "name": "1", "value": "1", "type": "number" },
        { "name": "2", "value": "2", "type": "number" },
        { "name": "3", "value": "3", "type": "number" },
        { "name": "+", "value": "+", "type": "method" },
        { "name": "0", "value": "0", "type": "number" },
        { "name": ".", "value": ".", "type": "number" },
        { "name": "=", "value": "=", "type": "result" }
    ];

    const handleColor = (type: string) => {
        let color = "";
        switch (type) {
            case "remove":
            case "all_remove":
            case "algebra":
                color = 'bg-algebra';
                break;
            case "method":
                color = 'bg-method';
                break;
            case "number":
            case "result":
                color = 'bg-number';
                break;
            default:
                break;
        }
        return color;
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (calculationHistory.length > 0 && result != "Error") {

            let updatedString = calculationHistory;
            if (calculationHistory.match(/[+\-*/]$/)) {
                updatedString = calculationHistory.slice(0, -1);
            }

            const postBody = {
                calculationName: calculationName,
                calculationPattern: updatedString,
                result: result
            }

            axiosInstance.createPost('/user/create-history', postBody)
                .then((response) => {
                    setHistory((prevState: HistoryItem[]) => [...prevState, response.userHistory.history]);
                })
                .catch((error) => {
                    console.error(error);
                });

            setCalculationHistory("");
            setCalculationName("");
        } else {
            alert("Something went wrong...")
        }
    }

    const handleAction = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
        console.log("type", type)
        switch (type) {
            case "remove":
                backspace();
                break;
            case "all_remove":
                clear();
                break;
            case "method":
            case "number":
            case "algebra":
                handleClick(e);
                break;
            case "result":
                calculate();
                break;
            default:
                break;
        }
    };

    return (
        <div className="w-[30%] space-y-5 md:px-10 sm:px-5 px-0">
            <h1 className='heading'>Calculator</h1>

            <div className="w-96">
                <input type="text" placeholder="" className="bg-[#565052] calculator-display"
                    value={result}
                    readOnly />
                <div className="grid grid-cols-4">
                    {inputButtonOption.map((option, index) => (
                        <button
                            key={index}
                            name={option.name}
                            className={`${option.value === "0" ? "col-span-2" : ""} ${handleColor(option.type)} h-20 w-full text-white text-3xl border-[1px] border-input p-5 element-hover`}
                            onClick={(e) => handleAction(e, option.type)}
                        >
                            {option.value}
                        </button>
                    ))}
                </div>
            </div>

            <form
                onSubmit={(e) => handleSave(e)}
                className='space-y-3'>
                <h2 className='heading whitespace-nowrap'>Calculation Name</h2>
                <div className='flex items-center space-x-5'>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        className="input-field"
                        value={calculationName}
                        onChange={(e) => setCalculationName(e.target.value)}
                    />
                    <button className='submit-button'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default Calculator;
