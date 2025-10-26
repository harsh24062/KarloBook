 
const calcTime = (mintues) =>{
    const hours = Math.floor( mintues / 60 );
    const min = mintues % 60;
    return `${hours} h ${min} m`;
}

export default calcTime