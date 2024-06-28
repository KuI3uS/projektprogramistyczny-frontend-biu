// Components/DataFetchingComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataFetchingComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('/api/data')
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    }, []);

    return <div>{data && JSON.stringify(data)}</div>;
};

export default DataFetchingComponent;