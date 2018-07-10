var scripts = require('../public/javascripts/planechat/PlanechatViewController');

describe("Planechat Tests", function () {
    it("should be true", function () {
        expect(true).toEqual(true);
    });

    it('should not be null', function () {
        expect(scripts).not.toEqual(null);
    });
});