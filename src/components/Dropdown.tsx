import { Icon, Icons } from "components/Icon";
import React, {
  MouseEventHandler,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

import { Backdrop, useBackdrop } from "components/layout/Backdrop";
import { ButtonControl } from "./buttons/ButtonControl";

export interface OptionItem {
  id: string;
  name: string;
}

interface DropdownProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: string;
  setSelectedItem: (value: string) => void;
  options: Array<OptionItem>;
}

export interface OptionProps {
  option: OptionItem;
  onClick: MouseEventHandler<HTMLDivElement>;
  tabIndex?: number;
}

function Option({ option, onClick, tabIndex }: OptionProps) {
  return (
    <div
      className="text-denim-700 flex h-10 cursor-pointer items-center space-x-2 px-4 py-2 text-left transition-colors hover:text-white"
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <input type="radio" className="hidden" id={option.id} />
      <label htmlFor={option.id} className="cursor-pointer ">
        <div className="item">{option.name}</div>
      </label>
    </div>
  );
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (props: DropdownProps, ref) => {
    const [setBackdrop, backdropProps, highlightedProps] = useBackdrop();
    const [delayedSelectedId, setDelayedSelectedId] = useState(
      props.selectedItem
    );

    useEffect(() => {
      let id: NodeJS.Timeout;

      if (props.open) {
        setDelayedSelectedId(props.selectedItem);
      } else {
        id = setTimeout(() => {
          setDelayedSelectedId(props.selectedItem);
        }, 200);
      }
      return () => {
        if (id) clearTimeout(id);
      };
      /* eslint-disable-next-line */
    }, [props.open]);

    const selectedItem: OptionItem =
      props.options.find((opt) => opt.id === props.selectedItem) ||
      props.options[0];

    useEffect(() => {
      setBackdrop(props.open);
      /* eslint-disable-next-line */
    }, [props.open]);

    const onOptionClick = (e: SyntheticEvent, option: OptionItem) => {
      e.stopPropagation();
      props.setSelectedItem(option.id);
      props.setOpen(false);
    };

    return (
      <div
        className="min-w-[140px]"
        onClick={() => props.setOpen((open) => !open)}
      >
        <div
          ref={ref}
          className="relative w-full sm:w-auto"
          {...highlightedProps}
        >
          <ButtonControl
            {...props}
            className="sm:justify-left bg-bink-200 hover:bg-bink-300 relative z-20 flex h-10 w-full items-center justify-center space-x-2 rounded-[20px] px-4 py-2 text-white"
          >
            <span className="flex-1">{selectedItem.name}</span>
            <Icon
              icon={Icons.CHEVRON_DOWN}
              className={`transition-transform ${
                props.open ? "rotate-180" : ""
              }`}
            />
          </ButtonControl>
          <div
            className={`bg-denim-300 scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 absolute top-0 z-10 w-full overflow-y-auto rounded-[20px] pt-[40px] transition-all duration-200 ${
              props.open
                ? "block max-h-60 opacity-100"
                : "invisible max-h-0 opacity-0"
            }`}
          >
            {props.options
              .filter((opt) => opt.id !== delayedSelectedId)
              .map((opt) => (
                <Option
                  option={opt}
                  key={opt.id}
                  onClick={(e) => onOptionClick(e, opt)}
                  tabIndex={props.open ? 0 : undefined}
                />
              ))}
          </div>
        </div>
        <Backdrop onClick={() => props.setOpen(false)} {...backdropProps} />
      </div>
    );
  }
);
