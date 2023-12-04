import type { ReactNode } from 'react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
// import { setupBitgetWallet } from '@near-wallet-selector/bitget-wallet';
// import { setupCoin98Wallet } from '@near-wallet-selector/coin98-wallet';
import type { AccountState, WalletSelector } from '@near-wallet-selector/core';
import { setupWalletSelector } from '@near-wallet-selector/core';
// import { setupFinerWallet } from '@near-wallet-selector/finer-wallet';
// import { setupHereWallet } from '@near-wallet-selector/here-wallet';
// import { setupLedger } from '@near-wallet-selector/ledger';
// import { setupMathWallet } from '@near-wallet-selector/math-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
// import { setupMintbaseWallet } from '@near-wallet-selector/mintbase-wallet';
import type { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupModal } from '@near-wallet-selector/modal-ui';
// import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
// import { setupNarwallets } from '@near-wallet-selector/narwallets';
// import { setupNearMobileWallet } from '@near-wallet-selector/near-mobile-wallet';
// import { setupNearWallet } from '@near-wallet-selector/near-wallet';
// import { setupNearFi } from '@near-wallet-selector/nearfi';
// import { setupNeth } from '@near-wallet-selector/neth';
// import { setupNightly } from '@near-wallet-selector/nightly';
// import { setupRamperWallet } from '@near-wallet-selector/ramper-wallet';
// import { setupSender } from '@near-wallet-selector/sender';
// import { setupWelldoneWallet } from '@near-wallet-selector/welldone-wallet';
// import { setupXDEFI } from '@near-wallet-selector/xdefi';
import { Spin } from 'antd';
import { env } from 'env.mjs';
import { distinctUntilChanged, map } from 'rxjs';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accounts: Array<AccountState>;
  accountId: string | null;
}

const WalletSelectorContext =
  React.createContext<WalletSelectorContextValue | null>(null);

const WalletSelectorContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: 'testnet',
      debug: true,
      modules: [
        // setupMyNearWallet(),
        // setupLedger(),
        // setupNearWallet(),
        // setupSender(),
        // setupBitgetWallet(),
        // setupMathWallet(),
        // setupNightly(),
        setupMeteorWallet(),
        // setupNarwallets(),
        // setupWelldoneWallet(),
        // setupHereWallet(),
        // setupCoin98Wallet(),
        // setupNearFi(),
        // setupRamperWallet(),
        // setupNeth({
        //   gas: '300000000000000',
        //   bundle: false,
        // }),
        // setupFinerWallet(),
        // setupXDEFI(),
        // setupNearMobileWallet(),
        // setupMintbaseWallet(),
      ],
    });
    const _modal = setupModal(_selector, {
      contractId: env.NEXT_PUBLIC_CONTRACT_ID,
    });
    const state = _selector.store.getState();
    setAccounts(state.accounts);

    // this is added for debugging purpose only
    // for more information (https://github.com/near/wallet-selector/pull/764#issuecomment-1498073367)
    window.selector = _selector;
    window.modal = _modal;

    setSelector(_selector);
    setModal(_modal);
    setLoading(false);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Failed to initialise wallet selector');
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged(),
      )
      .subscribe((nextAccounts) => {
        // eslint-disable-next-line no-console
        console.log('Accounts Update', nextAccounts);

        setAccounts(nextAccounts);
      });

    const onHideSubscription = modal!.on('onHide', ({ hideReason }) => {
      // eslint-disable-next-line no-console
      console.log(`The reason for hiding the modal ${hideReason}`);
    });

    return () => {
      subscription.unsubscribe();
      onHideSubscription.remove();
    };
  }, [selector, modal]);

  const walletSelectorContextValue = useMemo<WalletSelectorContextValue>(
    () => ({
      selector: selector!,
      modal: modal!,
      accounts,
      accountId: accounts.find((account) => account.active)?.accountId || null,
    }),
    [selector, modal, accounts],
  );

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <WalletSelectorContext.Provider value={walletSelectorContextValue}>
        {children}
      </WalletSelectorContext.Provider>
    </>
  );
};

function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      'useWalletSelector must be used within a WalletSelectorContextProvider',
    );
  }

  return context;
}

export default WalletSelectorContextProvider;
export { useWalletSelector };
