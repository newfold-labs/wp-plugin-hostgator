import { Button, Label } from "@yoast/ui-library";
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
			"yst-flex yst-flex-col yst-gap-1",
			className
		)}>
			<div className="yst-flex yst-justify-between yst-items-center">
				<Label className={"yst-cursor-default"}>{label}</Label>
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
			<p className="lg:yst-mr-[10.5rem]">
				{children}
			</p>
		</div>
	);
}

export default ActionField;