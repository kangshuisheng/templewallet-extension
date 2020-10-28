import { createStore, createEvent } from "effector";
import {
  ThanosState,
  ThanosStatus,
  ThanosAccount,
  ThanosSettings,
} from "lib/thanos/types";
import { NETWORKS } from "lib/thanos/networks";
import { Vault } from "lib/thanos/back/vault";

export interface StoreState extends ThanosState {
  inited: boolean;
  vault: Vault | null;
}

export interface UnlockedStoreState extends StoreState {
  vault: Vault;
}

export function toFront({
  status,
  accounts,
  networks,
  settings,
}: StoreState): ThanosState {
  return {
    status,
    accounts,
    networks,
    settings,
  };
}

/**
 * Events
 */

export const inited = createEvent<boolean>("Inited");

export const locked = createEvent("Locked");

export const unlocked = createEvent<{
  vault: Vault;
  accounts: ThanosAccount[];
  settings: ThanosSettings;
}>("Unlocked");

export const accountsUpdated = createEvent<ThanosAccount[]>("Accounts updated");

export const settingsUpdated = createEvent<ThanosSettings>("Settings updated");

/**
 * Store
 */

export const store = createStore<StoreState>({
  inited: false,
  vault: null,
  status: ThanosStatus.Idle,
  accounts: [],
  networks: [],
  settings: null,
})
  .on(inited, (state, vaultExist) => ({
    ...state,
    inited: true,
    status: vaultExist ? ThanosStatus.Locked : ThanosStatus.Idle,
    networks: NETWORKS,
  }))
  .on(locked, () => ({
    // Attention!
    // Security stuff!
    // Don't merge new state to exisitng!
    // Build a new state from scratch
    // Reset all properties!
    inited: true,
    vault: null,
    status: ThanosStatus.Locked,
    accounts: [],
    networks: NETWORKS,
    settings: null,
  }))
  .on(unlocked, (state, { vault, accounts, settings }) => ({
    ...state,
    vault,
    status: ThanosStatus.Ready,
    accounts,
    settings,
  }))
  .on(accountsUpdated, (state, accounts) => ({
    ...state,
    accounts,
  }))
  .on(settingsUpdated, (state, settings) => ({
    ...state,
    settings,
  }));

/**
 * Helpers
 */

export function withUnlocked<T>(factory: (state: UnlockedStoreState) => T) {
  const state = store.getState();
  assertUnlocked(state);
  return factory(state);
}

export function withInited<T>(factory: (state: StoreState) => T) {
  const state = store.getState();
  assertInited(state);
  return factory(state);
}

export function assertUnlocked(
  state: StoreState
): asserts state is UnlockedStoreState {
  assertInited(state);
  if (state.status !== ThanosStatus.Ready) {
    throw new Error("Not ready");
  }
}

export function assertInited(state: StoreState) {
  if (!state.inited) {
    throw new Error("Not initialized");
  }
}
