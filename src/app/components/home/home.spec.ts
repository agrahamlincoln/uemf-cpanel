import {
    it,
    inject,
    describe,
    beforeEachProviders,
} from 'angular2/testing';

// Load the implementations that should be tested
import {HomeComponent} from './home';

describe('Home', () => {
    // provide our implementations or mocks to the dependency injector
    beforeEachProviders(() => [
        HomeComponent
    ]);

    it('should always be true', inject([HomeComponent], (home) => {
        // spyOn(console, 'log');
        // expect(console.log).not.toHaveBeenCalled();
        //
        // home.ngOnInit();
        // expect(console.log).toHaveBeenCalledWith('Hello Home');
        expect(true).toBe(true);
    }));

});
