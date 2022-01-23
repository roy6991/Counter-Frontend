import counterAbi from '../../abis/counterAbi.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
console.log(contractAddress)

export async function getCounter(library) {
    if (!library) return 0;
    const CounterContract = new library.eth.Contract(counterAbi.abi, contractAddress);
    const counter = await CounterContract.methods.getCounter().call();
    return counter;
}

export async function incrementCounter(library, address, callback = () => {}) {
    if (!library) return;
    const CounterContract = new library.eth.Contract(counterAbi.abi, contractAddress);
    await CounterContract.methods.increment().send({ from: address });

    let results = await CounterContract.getPastEvents('UpdatedCounter', {}, (error, events) => console.log(events))
    
    let value = parseInt(results?.[0]?.returnValues?.['_counter'] || 0);
    callback?.(value);
}