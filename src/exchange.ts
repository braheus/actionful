export abstract class ActionfulExchange<
    Request extends object,
    Response extends object,
> {
    // Phantom properties to maintain type information
    private readonly _request!: Request;
    private readonly _response!: Response;
}
