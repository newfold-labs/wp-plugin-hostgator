import './stylesheet.scss';
import { Heading } from '../../components';
import help from '../../data/help';
import { getLinkPerRegion, supportsLinkPerRegion } from '../../util/helpers';

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon,
} from '@wordpress/components';

const Help = () => {
	return (
		<div className="hgwp-help">
			<div className="help grid col3">
				{help.map((item) => (
					supportsLinkPerRegion( item.url ) &&
					<Card
						size="small"
						className={`card-help card-help-${item.name}`}
						key={item.name}
					>
						<CardHeader>
							<Heading level="3">{item.title}</Heading>
						</CardHeader>
						<CardBody>
							{<item.Svg />}
							<p>{item.description}</p>
						</CardBody>
						<CardFooter>
							<Button
								variant="primary"
								href={ getLinkPerRegion( item.url, null, item.cta ) }
								target="_blank"
								icon={<Dashicon icon={item.icon} />}
							>
								{' '}
								{item.cta}{' '}
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
};

export default Help;
