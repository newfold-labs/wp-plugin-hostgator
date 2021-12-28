import './stylesheet.scss';

import { __ } from '@wordpress/i18n';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import help from '../../data/help';

const Help = () => {
	
	return (
		<div className="hgwp-help">
			<div className="help grid col2">

				{help.map((item) => (
					<Card size="small">
						<CardHeader>
							<Heading level="3">{item.title}</Heading> {item.icon &&<Dashicon icon={item.icon} size={20} />}
						</CardHeader>
						<CardBody>{item.description}</CardBody>
						<CardFooter>
							<Button variant="primary" href={item.url} target="_blank" icon={<Dashicon icon={item.icon} />}> {item.cta} </Button>
						</CardFooter>
					</Card>
				))}

			</div>
		</div>
	);
};

export default Help;
