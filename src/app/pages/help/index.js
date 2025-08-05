import help from '../../data/help';
import {
	getLinkPerRegion,
	supportsLinkPerRegion,
	handleHelpLinksClick,
} from '../../util/helpers';
import {
	Button,
	Card,
	Title,
	Container,
	Page,
} from '@newfold/ui-component-library';

const HelpCard = ( { item } ) => {
	return (
		<Card className={ `hgwp-help-card card-help-${ item.name }` }>
			<Card.Content>
				<Title as="h3" size="4" className="nfd-mb-2">
					{ item.title }
				</Title>
				<p>{ item.description }</p>
			</Card.Content>

			<Card.Footer>
				<Button
					variant="secondary"
					as="a"
					className="nfd-w-full nfd-transition-bg nfd-duration-100"
					href={ window.NewfoldRuntime.linkTracker.addUtmParams( getLinkPerRegion( item.id, item.cta ) ) }
					target="_blank"
				>
					{ item.cta }
				</Button>
			</Card.Footer>
		</Card>
	);
};

const Help = () => {
	handleHelpLinksClick();
	const renderHelpCards = () => {
		const helpItems = help;

		return (
			<div className="nfd-grid nfd-gap-6 nfd-grid-cols-1 sm:nfd-grid-cols-2 xl:nfd-grid-cols-3 2xl:nfd-grid-cols-4">
				{ helpItems.map(
					( item ) =>
						supportsLinkPerRegion( item.id ) && (
							<HelpCard key={ item.name } item={ item } />
						)
				) }
			</div>
		);
	};
	return (
		<Page className={ 'hgwp-app-help-page' }>
			<div className={ 'hgwp-app-help-page__header' }>
				<Title as ="h1">{ __( 'Help', 'wp-plugin-hostgator' ) }</Title>
				<Title as="h2" className="nfd-font-normal nfd-text-[13px]">
					{ __(
						'We are available 24/7 to help answer questions and solve your problems.',
						'wp-plugin-hostgator'
					) }
				</Title>
			</div>
			<Container
				className={
					'hgwp-app-help-container nfd-bg-transparent nfd-shadow-none'
				}
			>
				<Container.Block className={ 'nfd-p-0' }>
					{ renderHelpCards() }
				</Container.Block>
			</Container>
		</Page>
	);
};

export default Help;
