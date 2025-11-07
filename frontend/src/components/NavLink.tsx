import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import {cn} from "../lib/utils.ts";

/**
 * A React Router NavLink wrapper compatible with Tailwind + shadcn/ui.
 * Supports conditional active and pending classes.
 */
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
    className?: string;
    activeClassName?: string;
    pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
    ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
        return (
            <RouterNavLink
                ref={ref}
                to={to}
                {...props}
                className={({ isActive, isPending }) =>
                    cn(
                        "transition-colors duration-200",
                        className,
                        isActive && (activeClassName || "text-primary font-semibold"),
                        isPending && (pendingClassName || "opacity-70")
                    )
                }
            />
        );
    }
);

NavLink.displayName = "NavLink";

export { NavLink };
