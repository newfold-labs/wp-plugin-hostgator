import { Button, Label } from "@newfold/ui-component-library";
import classNames from "classnames";

const ActionField = ({
	label,
	buttonLabel,
	href,
	target,
	children,
	className,
	onClick
}) => {
	return (
		<div className={classNames(
			"nfd-flex nfd-flex-col nfd-gap-1",
			className
		)}>
			<div className="nfd-flex nfd-justify-between nfd-items-center">
				<Label className={"nfd-cursor-default"}>{label}</Label>
				<Button
					variant="secondary"
					as="a"
					href={href}
					target={target}
					onClick={onClick}
				>
					{buttonLabel}
				</Button>
			</div>
			<p className="lg:nfd-mr-[10.5rem]">
				{children}
			</p>
		</div>
	);
}

export default ActionField;