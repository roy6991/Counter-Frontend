import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import { getCounter, incrementCounter } from "../components/contract/counterContract";

export default function Home() {
    const [counter, setCounter] = useState(0);

    const { active, account, library, connector, activate, deactivate } =
        useWeb3React();

    async function connect() {
        try {
            if ('ontouchstart' in window || 'onmsgesturechange' in window) {
                const dappUrl = window.location.href;
                const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
                window.open(metamaskAppDeepLink, '_self');
            }
            await activate(injected);
        } catch (ex) {
            console.log(ex);
        }
    }

    async function disconnect() {
        try {
            deactivate();
        } catch (ex) {
            console.log(ex);
        }
    }

    async function increment() {
        try {
            await incrementCounter(library, account, (_counter) => setCounter(_counter))
        } catch (ex) {
            console.log(ex);
        }
    }

    useEffect(async () => {
        if (library) {
            let _counter = await getCounter(library);
            setCounter(_counter);
        }
    }, [library]);

    return (
        <div className="flex flex-col items-center justify-center">
            <button
                onClick={connect}
                className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            >
                Connect to MetaMask
            </button>
            {active ? (
                <span>
                    Connected with <b>{account}</b>
                </span>
            ) : (
                <span>Not connected</span>
            )}
            <button
                onClick={disconnect}
                className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            >
                Disconnect
            </button>

            <span>Current Coutner: {counter}</span>

            <button
                onClick={increment}
                className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            >
                Increment
            </button>
        </div>
    );
}
