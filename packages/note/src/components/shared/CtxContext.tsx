import {
  createComputed,
  createContext,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  getOwner,
  type JSX,
  lazy,
  onCleanup,
  onMount,
  runWithOwner,
  untrack,
  useContext,
} from "solid-js";
import h from "solid-js/h";
import { createStore } from "solid-js/store";
import { Match, Portal, Show, Suspense, Switch } from "solid-js/web";
import type { AnkiBackFields, AnkiDroidAPI, AnkiFrontFields } from "#/types";
import {
  type UseAnkiFieldContext,
  useAnkiFieldContext,
} from "./AnkiFieldsContext";
import {
  type UseBreakpointContext,
  useBreakpointContext,
} from "./BreakpointContext";
import { type UseCardContext, useCardContext } from "./CardContext";
import { type UseConfigContext, useConfigContext } from "./ConfigContext";

export type Ctx = {
  h: typeof h;
  createSignal: typeof createSignal;
  createEffect: typeof createEffect;
  createMemo: typeof createMemo;
  createResource: typeof createResource;
  createComputed: typeof createComputed;
  onMount: typeof onMount;
  onCleanup: typeof onCleanup;
  createContext: typeof createContext;
  useContext: typeof useContext;
  lazy: typeof lazy;
  ErrorBoundary: typeof ErrorBoundary;
  For: typeof For;
  Portal: typeof Portal;
  Show: typeof Show;
  Suspense: typeof Suspense;
  Switch: typeof Switch;
  Match: typeof Match;
  untrack: typeof untrack;
  runWithOwner: typeof runWithOwner;
  getOwner: typeof getOwner;
  createStore: typeof createStore;
  //
  ankiFields: AnkiFrontFields | AnkiBackFields;
  ankiDroidAPI: () => AnkiDroidAPI | undefined;
  useAnkiFieldContext: UseAnkiFieldContext;
  useBreakpointContext: UseBreakpointContext;
  useCardContext: UseCardContext;
  useConfigContext: UseConfigContext;
};

const CtxContext = createContext<Ctx>();

export function CtxContextProvider(props: { children: JSX.Element }) {
  const { ankiFields } = useAnkiFieldContext();
  const ctx: Ctx = {
    h,
    createSignal,
    createEffect,
    createMemo,
    createResource,
    createComputed,
    onMount,
    onCleanup,
    createContext,
    useContext,
    lazy,
    ErrorBoundary,
    For,
    Portal,
    Show,
    Suspense,
    Switch,
    Match,
    untrack,
    runWithOwner,
    getOwner,
    createStore,
    //
    ankiFields,
    ankiDroidAPI: () => KIKU_STATE.ankiDroidAPI,
    useAnkiFieldContext,
    useBreakpointContext,
    useCardContext,
    useConfigContext,
  };

  return (
    <CtxContext.Provider value={ctx}>{props.children}</CtxContext.Provider>
  );
}

export function useCtxContext() {
  const ctx = useContext(CtxContext);
  if (!ctx) throw new Error("Missing CtxContext");
  return ctx;
}
