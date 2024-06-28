// Components/MyButton.js
import React, { useCallback, useState } from 'react';

const MyButton = () => {
    const [count, setCount] = useState(0);

    const handleClick = useCallback(() => {
        setCount(count + 1);
    }, [count]);

    return <button onClick={handleClick}>Click me</button>;
};

export default MyButton;