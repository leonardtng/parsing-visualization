import React, {
  FC,
  HTMLAttributes,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import {
  ArrowToggle,
  ArrowToggleProps,
  Checkbox,
  CheckboxProps,
  CircularProgress,
} from "@/components";
import { useOutsideAlerter } from "@/helpers";

export interface SelectOption {
  key: string;
  label: string;
  image?: ReactNode;
}

type SingleSelectHandler = (event: SyntheticEvent, selected: string) => void;

type MultipleSelectHandler = (
  event: SyntheticEvent,
  selected: string[]
) => void;

interface SingleSelectProps {
  value?: string;
  onChange?: SingleSelectHandler;
}

interface MultipleSelectProps {
  value?: string[];
  onChange?: MultipleSelectHandler;
}

export type SelectModeProps<T> = T extends true
  ? SingleSelectProps
  : MultipleSelectProps;

export interface SelectBaseProps
  extends Omit<HTMLAttributes<HTMLInputElement>, "onChange"> {
  multiple?: boolean;
  showSelectAll?: boolean;
  options: SelectOption[];
  customLabel?: string;
  placeholder?: string;
  search?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  searchCallback?: (query: string) => void;
  arrowToggleProps?: ArrowToggleProps;
  checkboxProps?: CheckboxProps;
}

export type SelectProps = SelectModeProps<SelectBaseProps["multiple"]> &
  SelectBaseProps;

export const Select: FC<SelectProps> = ({
  options,
  value,
  onChange,
  customLabel,
  placeholder = "",
  search = false,
  multiple = false,
  showSelectAll = false,
  disabled = false,
  isLoading = false,
  searchCallback,
  arrowToggleProps,
  checkboxProps,
  className,
  ...componentProps
}: SelectProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>(
    typeof value === "string" ? [value] : value ?? []
  );
  const [query, setQuery] = useState<string>("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const getLabel = (key: string) =>
    options.find((option) => option.key === key)?.label ?? "";

  useOutsideAlerter(wrapperRef, (event) => {
    setShowOptions(false);
    if (search) {
      if (query.length > 0) {
        setQuery(getLabel(selected[0]));
      } else {
        setSelected([]);
        if (multiple) {
          if (onChange)
            (onChange as MultipleSelectHandler)(event as SyntheticEvent, []);
        } else {
          if (onChange)
            (onChange as SingleSelectHandler)(event as SyntheticEvent, "");
        }
      }
    }
  });

  const handleSelect = (
    event: SyntheticEvent,
    value: string,
    all: boolean = false
  ) => {
    if (search) setQuery(getLabel(value));

    if (multiple) {
      if (all) {
        if (selected.length === options.length) {
          setSelected([]);
          if (onChange) (onChange as MultipleSelectHandler)(event, []);
        } else {
          setSelected(options.map((option) => option.key));
          if (onChange)
            (onChange as MultipleSelectHandler)(
              event,
              options.map((option) => option.key)
            );
        }
      } else {
        if (selected.includes(value)) {
          const updatedState = selected.filter(
            (optionKey: string) => optionKey !== value
          );
          setSelected(updatedState);
          if (onChange)
            (onChange as MultipleSelectHandler)(event, updatedState);
        } else {
          setSelected([...selected, value]);
          if (onChange)
            (onChange as MultipleSelectHandler)(event, [...selected, value]);
        }
      }
    } else {
      setSelected([value]);
      setShowOptions(false);
      if (onChange) (onChange as SingleSelectHandler)(event, value);
    }
  };

  const inputProps = {
    disabled,
    className: `selectBase w-full flex items-center justify-between rounded-xl 
    border px-4 py-2 text-sm font-medium z-20 disabled:cursor-not-allowed
    text-fontPrimary dark:text-darkFontPrimary 
    bg-card disabled:hover:bg-card hover:bg-surface`,
  };

  const selectOptionClassName =
    "selectOption relative text-sm py-3 px-3 z-30 text-fontPrimary bg-card hover:cursor-pointer hover:bg-surface shadow-lg first:rounded-t-md last:rounded-b-md";

  const submenuAnimation: HTMLMotionProps<"div">["variants"] = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.3,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.2,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };

  useEffect(() => {
    if (value) setSelected(typeof value === "string" ? [value] : value);
    if (search && value?.length === 0 && selected.length > 0) setQuery("");
  }, [search, selected.length, value]);

  const filteredOptions = options.filter(
    (option: SelectOption) =>
      !search || option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      {...componentProps}
      className={`selectRoot w-64 relative ${
        showOptions ? "z-20" : "z-0"
      } ${className}`}
      ref={wrapperRef}
    >
      {search ? (
        <div className="relative">
          <input
            {...inputProps}
            placeholder={placeholder || "Search Option"}
            value={customLabel ?? query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (searchCallback) searchCallback(event.target.value);
            }}
            onFocus={() => setShowOptions(true)}
            className={`truncate pr-8 ${inputProps.className}`}
          />
          <div className="absolute top-[16px] right-[18px]">
            <ArrowToggle {...arrowToggleProps} trigger={showOptions} />
          </div>
        </div>
      ) : (
        <button {...inputProps} onClick={() => setShowOptions(!showOptions)}>
          <div className="selectLabel w-11/12 truncate text-left">
            {selected.length === 0 || options.length === 0 || isLoading ? (
              <span className="selectPlaceholder text-tagBackground opacity-40">
                {placeholder || "Select Option"}
              </span>
            ) : (
              customLabel ??
              selected.map(
                (optionKey: string, index: number) =>
                  `${
                    options.find(
                      (option: SelectOption) => option.key === optionKey
                    )?.label
                  }${index !== selected.length - 1 ? ", " : ""}`
              )
            )}
          </div>
          <ArrowToggle {...arrowToggleProps} trigger={showOptions} />
        </button>
      )}

      <AnimatePresence>
        <motion.div
          animate={showOptions ? "enter" : "exit"}
          initial="exit"
          className={`selectOptionsBase mb-2 ${
            filteredOptions.length > 0 || options.length > 0
              ? "h-fit"
              : "h-[160px]"
          } overflow-auto absolute z-30 w-full rounded-md border`}
          variants={submenuAnimation}
        >
          <ul className="selectOptionsList relative z-30 h-fit" role="none">
            {multiple && showSelectAll && (
              <li
                key="multipleSelectAll"
                id="multipleSelectAll"
                className={selectOptionClassName}
                onClick={(event) => handleSelect(event, "", true)}
              >
                <div
                  className="selectOptionLabelContainer relative
                  z-30 flex justify-between"
                >
                  <span className="selectAllLabel">Select All</span>

                  <Checkbox
                    {...checkboxProps}
                    checked={selected.length === options.length}
                    onChange={(event) => handleSelect(event, "", true)}
                  />
                </div>
              </li>
            )}
            {options.length > 0 && !isLoading ? (
              (searchCallback ? options : filteredOptions).map(
                ({ key, label, image }: SelectOption) => {
                  return (
                    <li
                      key={key}
                      id={key}
                      className={selectOptionClassName}
                      onClick={(event) =>
                        handleSelect(event, event.currentTarget.id)
                      }
                    >
                      <div
                        className="selectOptionLabelContainer relative
                       z-30 flex justify-between"
                      >
                        <div className="selectOptionLabelInnerContainer flex items-center gap-2">
                          {image}
                          <span className="selectOptionLabel">{label}</span>
                        </div>

                        {multiple && (
                          <Checkbox
                            {...checkboxProps}
                            checked={selected.includes(key)}
                            onChange={(event) => handleSelect(event, key)}
                          />
                        )}
                      </div>
                    </li>
                  );
                }
              )
            ) : (
              <div className="selectOptionLoader h-[160px] w-full flex justify-center items-center bg-card">
                {isLoading ? (
                  <CircularProgress height="20" width="20" />
                ) : (
                  "No options found"
                )}
              </div>
            )}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
