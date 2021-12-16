// import classNames from 'classnames';
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
import themes from '../../data/themes';

const Themes = () => {
	
	return (
		<div className="hgwp-themes grid col2">

			{themes.map((item) => (
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

export default Themes;
