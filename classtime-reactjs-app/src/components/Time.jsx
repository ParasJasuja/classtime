import React, { useState, useEffect } from 'react'

function Time() {
    const [time, setTime] = useState(new Date());
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="Time">
            {`${days[time.getDay()]}, ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}
        </div>
    )
}

export default Time
