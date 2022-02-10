import {
	Card,
	CardBody,
	CardHeader,
    CardFooter,
	Dashicon,
    Button,
	__experimentalHeading as Heading,
} from '@wordpress/components';

const PerformanceCallout = () => {

	return (
		<Card>
			<CardHeader>
				<Heading level="3">
					{__('Performance', 'hostgator-wordpress-plugin')}
				</Heading>
			</CardHeader>
			<CardBody>
				{__(
					'Manage site performance and caching settings as well as clear the site cache.',
					'hostgator-wordpress-plugin'
				)}
			</CardBody>
            <CardFooter>
                <Button
                    variant="primary"
                    href="#/performance"
					onClick={() => {window.scrollTo(0, 0)}}
                    icon={<Dashicon icon='performance' />}
                >
                    {__('Performance', 'hostgator-wordpress-plugin')}
                </Button>
            </CardFooter>
		</Card>
	);
};

export default PerformanceCallout;
