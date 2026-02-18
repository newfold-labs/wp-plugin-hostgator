import { createContext, useContext, useReducer } from '@wordpress/element';
import { Notifications } from '@newfold/ui-component-library';

const actions = { PUSH: 'push', DISMISS: 'dismiss' };

/**
 * @typedef FeedEntry
 * @property {string}                                         title       - Notice title.
 * @property {import('react').ReactNode | string[]}           description - Notice body content.
 * @property {"info" | "success" | "error" | "warning"}       variant     - Notice style variant.
 * @property {number}                                         autoDismiss - Auto-dismiss delay in ms.
 * @property {(id: string) => void | null}                    onDismiss   - Optional dismiss handler.
 * @property {"bottom-left" | "bottom-center" | "top-center"} position    - Notice position.
 */

/**
 * @typedef FeedReducerAction
 * @property {"push" | "dismiss"}        type    - Action type.
 * @property {string}                    id      - Notice id.
 * @property {FeedEntry?}                message - Notice payload for push.
 *
 * @param    {Record<string, FeedEntry>} feed    - Current feed state.
 * @param    {FeedReducerAction}         action  - Action to apply.
 * @return {Record<string, FeedEntry>} Updated feed state.
 */
function feedReducer( feed, action ) {
	switch ( action.type ) {
		case actions.PUSH:
			return { ...feed, [ action.id ]: action.message };
		case actions.DISMISS:
			return { ...feed, [ action.id ]: null };
		default:
			return feed;
	}
}

const FeedContext = createContext( {
	push: () => {},
} );

/** @type {() => { push: (id: string, message: FeedEntry) => void}}  */
export const useNotification = () => useContext( FeedContext );

export function NotificationFeed( { children } ) {
	const [ feed, dispatch ] = useReducer( feedReducer, {} );
	return (
		<>
			<FeedContext.Provider
				value={ {
					push: ( noticeId, noticeMessage ) =>
						dispatch( {
							type: actions.PUSH,
							id: noticeId,
							message: noticeMessage,
						} ),
				} }
			>
				{ children }
			</FeedContext.Provider>
			<Notifications>
				{ Object.entries( feed )
					.filter( ( [ , value ] ) => value !== null )
					.map( ( [ key, { description, ...entry } ] ) => {
						const contentProps = Array.isArray( description )
							? { description }
							: { children: description };
						return (
							<Notifications.Notification
								id={ key }
								key={ key }
								{ ...entry }
								{ ...contentProps }
								dismissScreenReaderLabel="Dismiss"
								onDismiss={ ( id ) => {
									dispatch( { type: actions.DISMISS, id } );
									if ( entry.onDismiss ) {
										entry.onDismiss( id );
									}
								} }
							/>
						);
					} ) }
			</Notifications>
		</>
	);
}
