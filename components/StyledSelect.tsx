import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./StyledSelect.module.css";

export type StyledSelectOption = {
    id: string;
    label: string;
}

export default function StyledSelect({ options, value, setValue }: { options: StyledSelectOption[], value: string, setValue: (value: string) => void }) {
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selectedOption = options.find(o => o.id === value);

    // Reorder options: selected option first, then the rest
    const orderedOptions = options
        .filter(o => o.id !== value)
        .length > 0 && selectedOption
        ? [selectedOption, ...options.filter(o => o.id !== value)]
        : options;

    const closeDropdown = useCallback(() => {
        setOpen(false);
        setFocusedIndex(-1);
    }, []);

    const handleSelect = (optionId: string) => {
        setValue(optionId);
        closeDropdown();
    };

    const toggleDropdown = () => {
        if (open) {
            closeDropdown();
        } else {
            setOpen(true);
            setFocusedIndex(-1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "ArrowDown" || (e.key === " " && !open)) {
            e.preventDefault();
            if (!open) {
                setOpen(true);
                setFocusedIndex(0);
            } else {
                setFocusedIndex(prev => (prev + 1) % orderedOptions.length);
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (open) {
                setFocusedIndex(prev => (prev - 1 + orderedOptions.length) % orderedOptions.length);
            }
        } else if (e.key === "Enter" && open && focusedIndex >= 0) {
            e.preventDefault();
            handleSelect(orderedOptions[focusedIndex].id);
        } else if (e.key === "Escape" && open) {
            e.preventDefault();
            closeDropdown();
        }
    };

    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSelect(orderedOptions[index].id);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((index + 1) % orderedOptions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((index - 1 + orderedOptions.length) % orderedOptions.length);
        } else if (e.key === "Escape") {
            e.preventDefault();
            closeDropdown();
        }
    };

    const handleOptionClick = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
        e.preventDefault();
        handleSelect(orderedOptions[index].id);
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeDropdown]);

    // Scroll focused option into view
    useEffect(() => {
        if (focusedIndex >= 0) {
            const el = containerRef.current?.querySelector(`[data-option-index="${focusedIndex}"]`);
            el?.scrollIntoView({ block: "nearest" });
        }
    }, [focusedIndex]);

    const optionElements: React.JSX.Element[] = [];
    orderedOptions.forEach((option, index) => {
        if (index !== 0) {
            optionElements.push(<div key={-index} className={styles.separator} aria-hidden="true"></div>)
        }

        optionElements.push(
            <li
                key={option.id}
                data-option-index={index}
                role="option"
                aria-selected={option.id === value}
                tabIndex={-1}
                className={`${styles.option} ${option.id === value ? styles.selected : ""} ${index === focusedIndex ? styles.focused : ""}`}
                onClick={e => handleOptionClick(e, index)}
                onKeyDown={(e) => handleOptionKeyDown(e, index)}
            >
                {option.label}
                {index === 0 ?
                    <span className={styles.chevron} aria-hidden="true">
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.88 9.87988L8 3.77322L14.12 9.87988L16 7.99988L8 -0.000118001L1.64355e-07 7.99988L1.88 9.87988Z"
                        fill="white"/>
                </svg>
            </span> : ""}
            </li>
        );
    });
    return (
        <div ref={containerRef} className={styles.container}>
            <button
                ref={triggerRef}
                type="button"
                className={styles.trigger}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Choisir une option"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
            >
                <span className={styles.label}>{selectedOption?.label}</span>
                <span className={styles.chevron} aria-hidden="true">
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.88 9.87988L8 3.77322L14.12 9.87988L16 7.99988L8 -0.000118001L1.64355e-07 7.99988L1.88 9.87988Z" fill="white"/>
                    </svg>
                </span>
            </button>
            {open && (
                <ul className={styles.listbox} role="listbox" aria-expanded={open} aria-label="Liste des options">
                    {optionElements}
                </ul>
            )}
        </div>
    );
}
