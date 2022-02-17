import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	CardMedia,
	__experimentalHeading as Heading,
} from '@wordpress/components';

const MarketplaceItem = ({ item }) => {
	return (
		<Card
			className={`marketplace-item-${item.name}`}
		>
			{item.img && (
				<CardMedia>
					<img src={item.img} alt={item.title + ' thumbnail'} />
				</CardMedia>
			)}
			<CardHeader>
				<Heading level="4">{item.title}</Heading>
				{item.price && <em className="price">${item.price}</em>}
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
