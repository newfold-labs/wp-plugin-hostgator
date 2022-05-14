import { Heading } from '../../components';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	CardMedia,
} from '@wordpress/components';

const MarketplaceItem = ({ item }) => {
	let imgpath = false;
	if ( item.img ) {
		imgpath = item.img.startsWith('http') ? item.img : window.HGWP.assets + item.img;
	}
	return (
		<Card className={`marketplace-item-${item.name}`}>
			{imgpath && (
				<CardMedia>
					<img src={imgpath} alt={item.title + ' thumbnail'} />
				</CardMedia>
			)}
			<CardHeader>
				<Heading level="4">{item.title}</Heading>
				{item.price && <em className="price">{item.price}</em>}
			</CardHeader>
			{item.description && <CardBody>{item.description}</CardBody>}
			<CardFooter>
				<Button variant="primary" href={item.url}>
					{' '}
					{item.cta}{' '}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default MarketplaceItem;
