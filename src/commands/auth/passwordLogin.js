export class PasswordLoginCommand {

}

export class PasswordLoginHandler {

    /**
     * @param command PasswordLoginCommand
     */
    handle = async(command) => {
        if (!command) throw new Error('Command must be provided');

    }
}