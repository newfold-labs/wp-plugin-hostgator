import { __ } from '@wordpress/i18n';
import {
	Button,
	Card,
	CardBody,
	CardMedia,
	CardHeader,
	CardFooter
} from '@wordpress/components';
import { __experimentalHeading as Heading } from '@wordpress/components';
import plugins from '../../data/plugins';

const Plugins = () => {
	
	return (
		<div className="hgwp-plugins grid col2">

			{plugins.map((item) => (
				<Card>
					{ item.img && 
					<CardMedia>
						<img src={item.img} />
					</CardMedia> }
					<CardHeader>
						<Heading level="4">{item.title}</Heading>
						{ item.price &&
						<em>${item.price}</em>
						}
					</CardHeader>
					{item.description &&
					<CardBody>{item.description}</CardBody>}
					<CardFooter>
						<Button variant="primary" href={ item.url }> { item.cta } </Button>
					</CardFooter>
				</Card>
            ))}

		</div>
	);
};

export default Plugins;
